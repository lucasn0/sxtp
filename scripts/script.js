window.onload=function(){
    const logo = document.getElementById('logo');
    let isFirstLogo = true;

    logo.addEventListener('click', () => {
        if (isFirstLogo) {
            logo.src = "images/sxtp_logo_2.png";
        } else {
            logo.src = "images/sxtp_logo_1.png";
        }
        isFirstLogo = !isFirstLogo;
});
}
