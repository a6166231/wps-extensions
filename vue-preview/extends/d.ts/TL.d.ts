
/** 根据参数的cfg数据，对str进行解析之后返回最终需要显示在界面上的文本、div */
type FormatFunction = (cfgs: any) => string

/** 以js脚本名为主键的方法  {@link ScriptMapVal}*/
type ScriptMapVal = (str: string) => {

    /** 格式化方法，会在指定table表解析之后由插件吊起 {@link FormatFunction}*/
    format: FormatFunction;

    /** 需要数据的表名，目前只支持当前路径下的文件查找
     * @see 不要传入文件后缀
     */
    table: string;

    /** 需要数据表的主键的行，会以该行作为json化的主键进行表格的json解析
     * @see 计数从1开始
     */
    key_row?: number;

    /** 表数据是否需要转键值对的形式
     * - 如果不为空，会返回以 key 为主键的键值对形式返回
     * - 如果为空，则返回列表形式的数据
     *  */
    key?: string;
}

/** 以js脚本名为主键的方法  {@link ScriptMapVal}*/
declare var scriptMap: { [key: string]: ScriptMapVal }