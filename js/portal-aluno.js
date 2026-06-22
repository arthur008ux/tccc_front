const form = document.getElementById("formPesquisa");

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const input = document.getElementById("pesquisa");
    const pesquisa = input.value.trim();

    if (!pesquisa) {
        Swal.fire({
            icon: "warning",
            title: "Atenção",
            text: "Digite um nome ou matrícula."
        });
        return;
    }

    Swal.fire({
        title: "Buscando...",
        text: "Redirecionando para o resultado",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading()
    });

    setTimeout(() => {
        window.location.href =
            `resultado.html?pesquisa=${encodeURIComponent(pesquisa)}`;
    }, 500);
});