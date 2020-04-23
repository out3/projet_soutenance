writeDateFR = function(date) {
    let months = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"];
    let nb = date.getDate()
    let month = months[date.getMonth()]
    let year = date.getFullYear()
    let hour = date.getHours()
    if (hour < 10) {hour = "0" + hour}
    let minutes = date.getMinutes()
    if (minutes < 10) {minutes = "0" + minutes}
    let result = nb + " " + month + " " + year + " à " + hour + ":" + minutes
    return result;
}
writeCurrentState = function(currentState) {
    switch(currentState) {
        case 0:
            return "En cours <i class='fas fa-circle text-warning'></i>"
            break;
        case 1:
            return "Acceptée <i class='fas fa-circle text-success'></i>"
            break;
        case 2:
            return "Refusée <i class='fas fa-circle text-danger'></i>"
            break;
        default:
            return "Erreur."
    };
}

writeLastUpdateDate = function(updates){
    let lastUpdate = ""
    if(updates.length > 0){
        lastUpdate = "Dernière mise à jour : " + writeDateFR(updates[updates.length-1].postedAt) + "<br>"
        return lastUpdate;
    } else {
        return "";
    }
} 