import chalk from "chalk"

export default function log(title, ...arr){
    if(process.env.NODE_ENV === "development"){
        
        console.groupCollapsed(chalk.blue(title))
        console.log(new Date().toLocaleTimeString())
        arr.forEach(a => console.log(a))
        console.groupEnd()
        console.log()
    }
   
}