const restaurant = (db) => {

    async function getTables() {
        // get all the available tables
       return await db.manyOrNone('SELECT * FROM table_booking');
    }

    async function bookTable(bookingDetails) {
        // book a table by name

        if(bookingDetails.tableName == null){
            return 'Please enter a table name';
        } else if(bookingDetails.username == null){
            return 'Please enter a username';
        } else if(bookingDetails.phoneNumber == null){
            return 'Please enter a contact number';
        } else if(bookingDetails.seats == null){
            return ' Please enter the number of occupants for the table';
        } else {
            //Proceed with the booking

            //make sure the table is not booked AND the capacity is within bounds
            if(await isTableBooked(bookingDetails.tableName) == false){
                let capacity = await db.oneOrNone('SELECT capacity FROM table_booking WHERE table_name=$1', [bookingDetails.tableName] );
                
                if(bookingDetails.seats <= capacity.capacity){
                    await db.none(`UPDATE table_booking
                                    SET booked = true, username = $1, number_of_people = $2, contact_number = $3
                                    WHERE table_name=$4`, [bookingDetails.username, bookingDetails.seats, bookingDetails.phoneNumber, bookingDetails.tableName]);

                    return 'Booking successful';
                } else {
                    return "capacity greater than the table seats";
                }
            } else {
                //Table booked!
                return 'table booked.';
            }
        }
        
        
        
    }

    async function getBookedTables() {
        // get all the booked tables
        
        //get all the tables
        let allTables = await getTables();
        
        let bookedTables = [];
        //filter the tables on "booked" property
        for(let i = 0; i < allTables.length; i++){
            if(allTables[i].booked == true){
                bookedTables.push(allTables[i]);
            }
        }
       // return the filter list
         return bookedTables;
    }

    async function isTableBooked(tableName) {
        // get booked table by name

        //Query the database using the name, and check for the booked condition
        let bookedOrNot = await db.oneOrNone('SELECT booked FROM table_booking WHERE table_name=$1', [tableName]);
        return bookedOrNot.booked;
    }

    async function cancelTableBooking(tableName) {
        // cancel a table by name

        //update the booked status of the table
        await db.none(`UPDATE table_booking
        SET booked = false, username = null, number_of_people = null, contact_number = null 
        WHERE table_name=$1`, [tableName])
        
    }

    async function getBookedTablesForUser(username) {
        // get user table booking
        return await db.manyOrNone('SELECT * FROM table_booking WHERE username=$1', [username])
    }

    async function getAvailableTables() {
        // get all the booked tables
        
        //get all the tables
        let allTables = await getTables();
        
        let availableTables = [];
        //filter the tables on "booked" property
        for(let i = 0; i < allTables.length; i++){
            if(allTables[i].booked == false){
                availableTables.push(allTables[i]);
            }
        }
       // return the filter list
         return availableTables;
    }

    return {
        getTables,
        bookTable,
        getBookedTables,
        isTableBooked,
        cancelTableBooking,
        getBookedTablesForUser,
        getAvailableTables
    }
}

export default restaurant;