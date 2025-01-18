export default function Logger(...msg: any[]): void {
    const now = new Date();
    const timestamp = now.toISOString(); 
  
    const formattedMsg = msg
      .map((part) => `[${part}]`)
      .join(' ');
  
    const colorReset = "\x1b[0m";
    const colorCyan = "\x1b[36m";
    const colorYellow = "\x1b[33m";
  
    console.log(`${colorCyan}[Logger]${colorReset} ${colorYellow}[${timestamp}]${colorReset} ${formattedMsg}`);
}