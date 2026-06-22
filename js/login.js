document.getElementById('loginForm').addEventListener('submit', async (e) => {

    e.preventDefault();

    const usuario = document.getElementById('usuario').value.trim();
    const senha = document.getElementById('senha').value.trim();

    if (!usuario || !senha) {
        Swal.fire({
            icon: 'warning',
            title: 'Atenção',
            text: 'Preencha usuário e senha.'
        });
        return;
    }

    try {

        const resposta = await fetch(
            'https://sistematcc-back-end-production.up.railway.app/login',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ usuario, senha })
            }
        );

        // 🔥 valida status HTTP primeiro
        if (!resposta.ok) {
            throw new Error(`Erro HTTP: ${resposta.status}`);
        }

        // 🔥 tenta ler JSON com segurança
        const texto = await resposta.text();
        console.log("Resposta bruta do servidor:", texto);

        let dados;
        try {
            dados = JSON.parse(texto);
        } catch (err) {
            throw new Error("Resposta do servidor não é JSON válido");
        }

        console.log("Dados parseados:", dados);

        // 🔥 login sucesso
        if (dados.sucesso) {

            sessionStorage.setItem(
                'adminLogado',
                JSON.stringify(dados.admin)
            );

            Swal.fire({
                icon: 'success',
                title: 'Login realizado!',
                text: `Bem-vindo ${dados.admin.usuario}`
            }).then(() => {

                // 🚀 redireciona pro dashboard
                window.location.href = 'dashboard.html';

            });

        } else {

            Swal.fire({
                icon: 'error',
                title: 'Erro',
                text: dados.mensagem || 'Usuário ou senha inválidos.'
            });

        }

    } catch (erro) {

        console.error("Erro no login:", erro);

        Swal.fire({
            icon: 'error',
            title: 'Erro de conexão',
            text: 'Não foi possível conectar ao servidor.'
        });

    }

});