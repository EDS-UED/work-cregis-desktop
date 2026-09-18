import { waasProjectShellApiRegistry } from '@/scenes/project/waasProjectShellApi';
import { transactionRecordsDataListShellApiRegistry } from '@/scenes/transaction-records/transactionRecordsDataListShellApi';
import { tasksDataListShellApiRegistry } from '@/scenes/tasks/tasksDataListShellApi';
type DataListShellApi = {
  setListEmpty: (empty: boolean) => void;
  setListIniting: (initing: boolean) => void;
  setListLoading: (loading: boolean) => void;
  showDangerToast: (message: string) => void;
};

function readDataListShellApi(): DataListShellApi | null {
  return (
    tasksDataListShellApiRegistry.value
    ?? transactionRecordsDataListShellApiRegistry.value
  );
}

const QA_LOADING_TIMEOUT_MS = 60_000;
const QA_LOADING_TIMEOUT_MESSAGE = '连接超时，请稍后重试。';

let qaLoadingTimeoutTimer: ReturnType<typeof setTimeout> | undefined;

export function clearQaLoadingTimeout() {
  if (qaLoadingTimeoutTimer !== undefined) {
    clearTimeout(qaLoadingTimeoutTimer);
    qaLoadingTimeoutTimer = undefined;
  }
}

/** 两个加载态互斥：设计系统里「初始化」与「加载中」描述的是不同阶段，不叠加。 */
function startQaLoadingTimeout(release: () => void) {
  qaLoadingTimeoutTimer = window.setTimeout(() => {
    qaLoadingTimeoutTimer = undefined;
    release();
    readDataListShellApi()?.showDangerToast(QA_LOADING_TIMEOUT_MESSAGE);
  }, QA_LOADING_TIMEOUT_MS);
}

export function applyEmptyPageScenario() {
  clearQaLoadingTimeout();

  const waasApi = waasProjectShellApiRegistry.value;
  if (waasApi) {
    waasApi.setProjectsEmpty(true);
    return;
  }

  const api = readDataListShellApi();
  if (!api) return;
  api.setListIniting(false);
  api.setListLoading(false);
  api.setListEmpty(true);
}

/**
 * 设计系统「初始化」= `EgDataList initing`：首次加载、尚无数据时表头以下整块加载态。
 * 与进入列表页时的真实状态一致；内建 500ms 延迟由 EDS 控制。
 */
export function applyInitingScenario() {
  clearQaLoadingTimeout();
  waasProjectShellApiRegistry.value?.setProjectsEmpty(false);

  const api = readDataListShellApi();
  if (!api) return;
  api.setListEmpty(false);
  api.setListLoading(false);
  api.setListIniting(true);
  startQaLoadingTimeout(() => {
    readDataListShellApi()?.setListIniting(false);
  });
}

/**
 * 设计系统「加载中」= `EgDataList loading`：已有数据时重新拉取的顶部加载条。
 * 保持加载态直至执行其它场景、reset 或 60s 超时。
 */
export function applyLoadingScenario() {
  clearQaLoadingTimeout();
  waasProjectShellApiRegistry.value?.setProjectsEmpty(false);

  const api = readDataListShellApi();
  if (!api) return;
  api.setListEmpty(false);
  api.setListIniting(false);
  api.setListLoading(true);
  startQaLoadingTimeout(() => {
    readDataListShellApi()?.setListLoading(false);
  });
}
