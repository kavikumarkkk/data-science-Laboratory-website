function SubmitHandler(e)
{
    //alert("gg");
    e.preventDefault();

    const db = "https://script.google.com/macros/s/AKfycbwUgoNcHi6BvwbwFODLkJqFrQAaDoCQwU2BwT6Pz_Kj-QlVylxR0azYK3rem0sSZAtD/exec";
    //document.querySelector('#spinner-career').classList.remove('spinner-hide');
    let form = document.querySelector("#frm");

        fetch(db, {method: "POST", body: new FormData(form)})
        .then(res => {
          console.log(res);
          window.location.reload();
        })
        .catch(err => {console.error("Error: ", err.message)}) 
}
