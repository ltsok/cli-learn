export class WafTopoExtraInfoModel {
  public title;
  public id;
  public name;
  public ip;
  public latitude;
  public longitude;
  public portInfos;
  public status;

  constructor(p_title, p_id, p_name, p_ip, p_latitude, p_longitude, p_portInfos, p_status) {
    this.title = p_title;
    this.id = p_id;
    this.name = p_name;
    this.ip = p_ip;
    this.latitude = p_latitude;
    this.longitude = p_longitude;
    this.portInfos = p_portInfos;
    this.status = p_status;
  }
}
