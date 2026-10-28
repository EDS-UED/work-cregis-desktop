import { installAnchoredTooltipCoexistGuard } from '@/utils/installAnchoredTooltipCoexistGuard';

/** 始终安装锚定浮层 coexist guard（AML + hover）；Shell Debug 关闭时仍须 hover 不关 click Popover。 */
installAnchoredTooltipCoexistGuard();
