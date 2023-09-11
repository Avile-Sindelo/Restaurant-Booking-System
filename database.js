export default function RestaurantTableBooking(db){
    async function getTables(){
        // Show tables that can be booked
       return await db.manyOrNone('SELECT * FROM table_booking');
    }

    async function bookTable(bookingInfo){
        //get the tables 
        //filter the tables according to the "booked" property
        //if the
    }

    // allow client to book a table that is not already booked
    //Hide the radio button if the table has already been booked


    return {
        getTables,
        bookTable
    }
}