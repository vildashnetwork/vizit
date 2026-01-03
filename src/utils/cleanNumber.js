export function cleanNumber(stringg){
    return parseInt(stringg.replace(/\D/g, ""), 10)
}