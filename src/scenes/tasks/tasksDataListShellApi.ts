import { shallowRef } from 'vue';

/** 列表页 · Shell 外 QA 可调用的反馈 API。 */
export type TasksDataListShellApi = {
  setListEmpty: (empty: boolean) => void;
  /** EDS `initing`（设计系统「初始化」）：首次加载、尚无数据时的整块加载态。 */
  setListIniting: (initing: boolean) => void;
  /** EDS `loading`（设计系统「加载中」）：已有数据时重新拉取的顶部加载条。 */
  setListLoading: (loading: boolean) => void;
  showDangerToast: (message: string) => void;
  showSuccessFeedback: (messageKey: string) => void;
};

export const tasksDataListShellApiRegistry = shallowRef<TasksDataListShellApi | null>(null);

export function registerTasksDataListShellApi(api: TasksDataListShellApi | null) {
  tasksDataListShellApiRegistry.value = api;
}
