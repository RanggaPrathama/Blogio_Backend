import colors from "colors"

export class ColorsTerminals {

    static logSuccess(message:string){
        return `${colors.cyan("[SUCCESS]")} ${colors.green(message)}`
    }

    static logError(message:string){
        return `${colors.cyan("[ERROR]")} ${colors.red(message)}` 
    }

    static logInfo(message:string){
        return `${colors.cyan("[INFO]")} ${colors.yellow(message)}`
    }
}