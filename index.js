import express from "express";
import autenticar from "./seguranca/autenticar.js";
import session from "express-session";

const porta = 3000;
const localhost = "0.0.0.0";

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(session({
    secret: "m1Nh4Ch4v3S3cR3t4",
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 15 // 15 minutos de sessão
    }
}));

// Rotas de autenticação
app.get("/login", (req, res) => {
    res.redirect('/login.html');
});

app.post("/login", (req, res) => {
    const usuario = req.body.usuario;
    const senha = req.body.senha;
    if (usuario === "admin" && senha === "admin") {
        req.session.autenticado = true;
        res.redirect('/menu.html');
    } else {
        res.redirect('/login.html');
    }
});

app.get("/logout", (req, res) => {
    req.session.destroy();
    res.redirect('/login.html');
});

// Dados dos pacotes de viagem (em memória)
const pacotes = [
    {
        id: 1,
        nome: "Pacote para Paris",
        dataPartida: "2025-06-15",
        destino: "Paris, França",
        preco: 3000,
        descricao: "Experiência inesquecível na cidade do amor.",
        duracao: "7 dias",
        localPartida: "São Paulo",
        lugares: 20
    },
    {
        id: 2,
        nome: "Pacote para Nova York",
        dataPartida: "2025-07-10",
        destino: "Nova York, EUA",
        preco: 3500,
        descricao: "Descubra a Big Apple em grande estilo.",
        duracao: "5 dias",
        localPartida: "Rio de Janeiro",
        lugares: 15
    }
];

// API para retornar a lista de pacotes
app.get("/api/pacotes", (req, res) => {
    res.json(pacotes);
});

// API para retornar os detalhes de um pacote específico
app.get("/api/pacotes/:id", (req, res) => {
    const id = Number(req.params.id);
    const pacote = pacotes.find(p => p.id === id);
    if (pacote) {
        res.json(pacote);
    } else {
        res.status(404).json({ error: "Pacote não encontrado" });
    }
});

// Servir arquivos públicos (pasta publico)
app.use(express.static("./publico"));

// Servir arquivos privados (pasta privado) – somente para usuários autenticados
app.use(autenticar, express.static("./privado"));

app.listen(porta, localhost, () => {
    console.log(`Servidor rodando em http://${localhost}:${porta}`);
});
