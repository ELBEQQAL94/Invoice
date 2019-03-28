const express = require('express');
const app     = express();
const port    = process.env.PORT || 5000;
const Odoo    = require('odoo-xmlrpc');

app.listen(port, () => console.log(`Lestening on port ${port}`));

const odoo = new Odoo({
    url: 'https://econostic-youssef.odoo.com',
    db: 'econostic-youssef',
    username: 'xmlrpc@econostic.net',
    password: 'xmlrpc'
});

app.get('/invoice_lists', (req, res) => {
    odoo.connect(err => {
        if(err) { return console.log(err);}
        console.log('connect to odoo server. ');
        let inParams = [];
        inParams.push([['is_company', '=', true],['customer', '=', true]]);
        inParams.push(0);  //offset
        inParams.push(1);  //Limit
        let params = [];
        params.push(inParams);
        odoo.execute_kw(
            'res.partner', 
            'search', 
            params, 
            (err, value) => {
        if (err) { return console.log(err); }
        let inParams = [];
        inParams.push(value); //ids
        let params = [];
        params.push(inParams);
        odoo.execute_kw(
            'res.partner', 
            'read', 
            params, 
            (err2, value2) => {
            if (err2) { return console.log(err2); }
            console.log('Result: ', value2);
            res.send({
              invoices : value2    
            });
        });
    });
    });
})
