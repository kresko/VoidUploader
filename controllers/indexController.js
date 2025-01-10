

async function renderHomepage(req, res) {
    res.render('index', { user: req.user });
}

module.exports = {
    renderHomepage
};