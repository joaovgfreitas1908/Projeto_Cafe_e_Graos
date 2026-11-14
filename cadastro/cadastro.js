
document.addEventListener("DOMContentLoaded", function () {

    const formulario = document.getElementById("form-cadastro");
    const botaoCadastrar = document.getElementById("btn-cadastrar");
    const notificacao = document.getElementById("notificacao-cadastro");

    const nome = document.getElementById("nome");
    const cpf = document.getElementById("CPF");
    const cep = document.getElementById("CEP");
    const celular = document.getElementById("celular");
    const telefone = document.getElementById("telefone");
    const email = document.getElementById("Email");
    const senha = document.getElementById("senha");
    const confirmacao = document.getElementById("confirmacao");


    // MOSTRAR E OCULTAR SENHAS

    const olhoAberto = `
        <svg xmlns="http://www.w3.org/2000/svg"
             width="20" height="20" viewBox="0 0 24 24"
             fill="none" stroke="currentColor"
             stroke-width="2" stroke-linecap="round"
             stroke-linejoin="round">
            <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>
            <circle cx="12" cy="12" r="3"/>
        </svg>
    `;

    const olhoFechado = `
        <svg xmlns="http://www.w3.org/2000/svg"
             width="20" height="20" viewBox="0 0 24 24"
             fill="none" stroke="currentColor"
             stroke-width="2" stroke-linecap="round"
             stroke-linejoin="round">
            <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/>
            <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/>
            <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/>
            <line x1="2" y1="2" x2="22" y2="22"/>
        </svg>
    `;

    function configurarToggleSenha(idInput, idBotao) {

        const input = document.getElementById(idInput);
        const botao = document.getElementById(idBotao);

        if (!input || !botao) return;

        function atualizarOlho() {

            const estaOculta = input.type === "password";

            botao.innerHTML = estaOculta
                ? olhoFechado
                : olhoAberto;

            const descricao = estaOculta
                ? "Mostrar senha"
                : "Ocultar senha";

            botao.setAttribute("aria-label", descricao);
            botao.setAttribute("title", descricao);
        }

        atualizarOlho();

        botao.addEventListener("click", function () {

            input.type = input.type === "password"
                ? "text"
                : "password";

            atualizarOlho();
        });
    }

    configurarToggleSenha("senha", "toggle-senha");
    configurarToggleSenha("confirmacao", "toggle-confirmacao");


    // MÁSCARAS DOS CAMPOS

    cpf.addEventListener("input", function () {

        let valor = this.value.replace(/\D/g, "").slice(0, 11);

        valor = valor.replace(/(\d{3})(\d)/, "$1.$2");
        valor = valor.replace(/(\d{3})(\d)/, "$1.$2");
        valor = valor.replace(/(\d{3})(\d{1,2})$/, "$1-$2");

        this.value = valor;
    });

    cep.addEventListener("input", function () {

        let valor = this.value.replace(/\D/g, "").slice(0, 8);

        valor = valor.replace(/(\d{5})(\d)/, "$1-$2");

        this.value = valor;
    });

    celular.addEventListener("input", function () {

        let valor = this.value.replace(/\D/g, "").slice(0, 11);

        valor = valor.replace(/^(\d{2})(\d)/, "($1) $2");
        valor = valor.replace(/(\d{5})(\d{4})$/, "$1-$2");

        this.value = valor;
    });

    telefone.addEventListener("input", function () {

        let valor = this.value.replace(/\D/g, "").slice(0, 10);

        valor = valor.replace(/^(\d{2})(\d)/, "($1) $2");
        valor = valor.replace(/(\d{4})(\d{4})$/, "$1-$2");

        this.value = valor;
    });


    // EXIBIR MENSAGENS DE ERRO

    function mostrarErro(input, mensagem) {

        const grupo = input.closest(".form-group");

        input.classList.add("input-erro");
        input.setAttribute("aria-invalid", "true");

        grupo.classList.remove("erro-animacao");

        void grupo.offsetWidth;

        grupo.classList.add("erro-animacao");

        let mensagemErro = grupo.querySelector(".mensagem-erro");

        if (!mensagemErro) {

            mensagemErro = document.createElement("span");
            mensagemErro.className = "mensagem-erro";

            mensagemErro.setAttribute("role", "alert");

            grupo.appendChild(mensagemErro);
        }

        mensagemErro.textContent = mensagem;

        setTimeout(function () {
            grupo.classList.remove("erro-animacao");
        }, 400);
    }


    // REMOVER MENSAGENS DE ERRO

    function removerErro(input) {

        const grupo = input.closest(".form-group");

        input.classList.remove("input-erro");
        input.removeAttribute("aria-invalid");

        const mensagemErro = grupo.querySelector(".mensagem-erro");

        if (mensagemErro) {
            mensagemErro.remove();
        }
    }


    // REMOVER ERROS AO DIGITAR

    formulario.querySelectorAll("input").forEach(function (input) {

        input.addEventListener("input", function () {

            removerErro(input);

            notificacao.classList.remove("visivel");
            notificacao.textContent = "";
        });
    });


    // VALIDAR CPF

    function validarCPF(valor) {

        const numeros = valor.replace(/\D/g, "");

        if (numeros.length !== 11) {
            return false;
        }

        if (/^(\d)\1{10}$/.test(numeros)) {
            return false;
        }

        for (let tamanho = 9; tamanho <= 10; tamanho++) {

            let soma = 0;

            for (let i = 0; i < tamanho; i++) {
                soma += Number(numeros[i]) * (tamanho + 1 - i);
            }

            let digito = (soma * 10) % 11;

            if (digito === 10) {
                digito = 0;
            }

            if (digito !== Number(numeros[tamanho])) {
                return false;
            }
        }

        return true;
    }


    // VALIDAR E-MAIL

    function validarEmail(valor) {

        const expressao = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        return expressao.test(valor.trim());
    }


    // VALIDAÇÃO DO FORMULÁRIO

    formulario.addEventListener("submit", function (evento) {

        evento.preventDefault();

        let formularioValido = true;
        let primeiroCampoInvalido = null;

        formulario.querySelectorAll("input").forEach(function (input) {
            removerErro(input);
        });

        function verificar(input, condicao, mensagem) {

            if (condicao) {

                mostrarErro(input, mensagem);

                formularioValido = false;

                if (!primeiroCampoInvalido) {
                    primeiroCampoInvalido = input;
                }
            }
        }


        // Nome completo

        verificar(
            nome,
            nome.value.trim().split(/\s+/).length < 2 ||
            nome.value.trim().length < 3,
            "Digite seu nome completo."
        );


        // CPF obrigatório

        verificar(
            cpf,
            !validarCPF(cpf.value),
            "Digite um CPF válido."
        );


        // CEP obrigatório

        verificar(
            cep,
            cep.value.replace(/\D/g, "").length !== 8,
            "Digite um CEP válido."
        );


        // Celular obrigatório

        verificar(
            celular,
            celular.value.replace(/\D/g, "").length !== 11,
            "Digite um celular válido com DDD."
        );


        // Telefone fixo obrigatório

        verificar(
            telefone,
            telefone.value.replace(/\D/g, "").length !== 10,
            "Digite um telefone fixo válido com DDD."
        );


        // E-mail obrigatório

        verificar(
            email,
            !validarEmail(email.value),
            "Digite um e-mail válido."
        );


        // Senha obrigatória

        verificar(
            senha,
            senha.value.length < 6,
            "A senha deve ter no mínimo 6 caracteres."
        );


        // Confirmação de senha obrigatória

        if (confirmacao.value.trim() === "") {

            verificar(
                confirmacao,
                true,
                "Confirme sua senha."
            );

        } else if (senha.value !== confirmacao.value) {

            verificar(
                confirmacao,
                true,
                "As senhas não coincidem."
            );
        }


        // IMPEDIR CADASTRO COM ERROS

        if (!formularioValido) {

            primeiroCampoInvalido.focus();

            return;
        }


        // SIMULAÇÃO DE CADASTRO REALIZADO

        botaoCadastrar.disabled = true;

        botaoCadastrar.textContent = "Cadastrando...";

        setTimeout(function () {

            botaoCadastrar.classList.add("btn-sucesso");

            botaoCadastrar.textContent = "Conta criada!";

            notificacao.textContent =
                "Cadastro validado com sucesso!";

            notificacao.classList.add("visivel");

            setTimeout(function () {

                botaoCadastrar.disabled = false;

                botaoCadastrar.classList.remove("btn-sucesso");

                botaoCadastrar.textContent = "Cadastrar";

            }, 2000);

        }, 1200);
    });


    // BARRA DE ACESSIBILIDADE

    const aumentarFonte = document.getElementById("aumentar-fonte");
    const diminuirFonte = document.getElementById("diminuir-fonte");
    const alternarTema = document.getElementById("alternar-tema");

    let escalaFonte = 1;

    const textos = document.querySelectorAll(
        "h1, h2, h3, p, label, input, button, a, small, span"
    );

    textos.forEach(function (elemento) {

        elemento.dataset.fonteOriginal =
            parseFloat(getComputedStyle(elemento).fontSize);
    });


    // ALTERAR TAMANHO DA FONTE

    function atualizarFonte() {

        textos.forEach(function (elemento) {

            const tamanhoOriginal =
                Number(elemento.dataset.fonteOriginal);

            elemento.style.fontSize =
                (tamanhoOriginal * escalaFonte) + "px";
        });
    }


    // AUMENTAR FONTE

    aumentarFonte.addEventListener("click", function () {

        if (escalaFonte < 1.4) {

            escalaFonte =
                Math.round((escalaFonte + 0.1) * 10) / 10;

            atualizarFonte();
        }
    });


    // DIMINUIR FONTE

    diminuirFonte.addEventListener("click", function () {

        if (escalaFonte > 0.8) {

            escalaFonte =
                Math.round((escalaFonte - 0.1) * 10) / 10;

            atualizarFonte();
        }
    });


    // MODO CLARO E ESCURO

    function atualizarIconeTema() {

        const modoEscuro =
            document.body.classList.contains("modo-escuro");

        alternarTema.textContent =
            modoEscuro ? "☀️" : "🌙";

        alternarTema.setAttribute(
            "aria-label",
            modoEscuro ? "Ativar tema claro" : "Ativar tema escuro"
        );
    }

    alternarTema.addEventListener("click", function () {

        document.body.classList.toggle("modo-escuro");

        atualizarIconeTema();
    });

    atualizarIconeTema();

});
