
// function fadeOutEntry(entry) {
//     $(entry).fadeOut(2000, function() { 
//         // $(this).remove(); 
//     });
// }

// let fadeOutTime = 10000; // 1 minute in milliseconds
// setTimeout(function() {
//     fadeOutEntry(entry);
// }, fadeOutTime);

//this one only
function fadeOutEntry(entry) {
    $(entry).fadeTo(2000, 0)
}

// let fadeOutTime = 10000; 
// setTimeout(function() {
//     fadeOutEntry(entry);
// }, fadeOutTime);

