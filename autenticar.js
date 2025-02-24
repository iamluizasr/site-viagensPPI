//três parâmetros:
// requisicao, resposta, next (prosseguir)
// os parâmetros são fornecidos automaticamente pelo express
export default function autenticar(req, res, next) {
    if (req.session.autenticado === true) {
        next();
    } else {
        res.redirect('/login.html');
    }
}
