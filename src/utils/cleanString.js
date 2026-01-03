export function cleanString(str){
   return  str.trim().split("24/7").join("").split("/").join("").split("-").join("").replaceAll(" ","").toLocaleLowerCase();   
}