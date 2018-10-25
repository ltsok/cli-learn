
/**
 * 登录接口模型：登录输入
 * @export
 * @class TpiLoginInput
 */
export class TpiLoginInput {

  /** 用户名 */
  name: string;

  /** 密码 */
  password: string;

  /** 语言 */
  lang: string;

  /** 验证码 */
  verCode: string;

  /** 扩展信息 */
  extInfo: Map<string, string> = new Map<string, string>();
}

/**
 * 登录接口服务模型：登录输出
 * @export
 * @class TpiLoginOutput
 */
export class TpiLoginOutput {

  /** token标识 */
  token: string;

  /** 登录用户 */
  user: any;

  /** 用户级配置 */
  userCfg: Map<string, string> = new Map<string, string>();

  /** 系统级配置 */
  sysCfg: Map<string, string> = new Map<string, string>();
}

/**
 * 登录信息
 * @export
 * @class LoginInfo
 */
export class LoginInfo {

  /** 登录标志 */
  isLogin: boolean = false;

  /** 用户基本信息 */
  user: any;
}
