const TicketControl = require('../models/ticket-control');

const ticketControl = new TicketControl;

const socketController = (socket) => {

    socket.emit('ultimo-ticket', ticketControl.ultimo);
    socket.emit('estado-actual', ticketControl.ultimos4);
    
    socket.on('siguiente-ticket', ( payload, callback ) => {
        
        const siguiente = ticketControl.siguiente();
        callback(siguiente);

    });

    socket.on('atender-ticket', ({escritorio}, callback) => {
        if(!escritorio){
            return callback({
                ok:false,
                msg: 'El escritorio es obligatorio'
            });
        }

        const ticket = ticketControl.atenderTicket(escritorio);
        socket.broadcast.emit('estado-actual', ticketControl.ultimos4);
        if(!ticket){
            return callback({
                ok:false,
                msg: 'No hay tickets pendientes'
            });
        }
        else {
            return callback({
                ok: true,
                ticket
            });
        }
    });

}



module.exports = {
    socketController
}

