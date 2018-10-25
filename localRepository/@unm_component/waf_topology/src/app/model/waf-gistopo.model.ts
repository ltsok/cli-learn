export class WafTopoModel {
  public id: string = null;
  public ip: string = null;
  public neType: string = null;
  public name: string = null;
  public status: number = null;
  // 坐标（如果是逻辑域，则取其下所有点的中心坐标。）
  public centerLatLng: any = {latitude:-1, longitude:-1};
  public radius: number = 0;
  // 0：逻辑域，1：网元
  public type: number = -1;
  // 里面装的还是WafTopoModel
  public childList = [];
  // 父节点
  public parent: WafTopoModel = null;
  // 层次(从0开始，若parent为空，则level为0）
  public level: number = 0;
  // 是否展开(true：展开，false：收拢)
  public expanded: boolean = false;
  // linkIds(这里改用List，是因为有可能存在2个网元之间多条连线的情况)
  public linkGISNcdBeanIds = [];
  public portInfos = [];
  // ltpId,linkIds(下面的3个集合是同步的)
  public leftLtpIds = [];
  public rightLtpIds = [];
  public linkIds = [];
  // InfoWindow
  public infoWindow = null;
}
