export default class CommonUtils {
  
  /**
   * Check if the current environment is development.
   * @returns {boolean} If the current environment is development.
   */
  public static isDevelopment(): boolean {
    return process.env.NODE_ENV === 'development';
  }
}