export default class CommonUtils {
  
  public static isDevelopment(): boolean {
    return process.env.NODE_ENV === 'development';
  }
}