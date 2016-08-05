
import PouchDB from 'pouchdb';
import { Adapter } from 'ember-pouch';

const remote = new PouchDB(window.BusyFFL.API_URL);
const db = new PouchDB('local_pouch');

db.sync(remote, {
  live: true,
  retry: true
});

//db.login('suclimbing', 'twenty20').then((auth) => {
//    console.log("I'm Batman.", auth);
//    //return db.logout();
//});

//db.login(window.BusyFFL.CLOUDANT_KEY, window.BusyFFL.CLOUDANT_PASSWORD).then((auth) => {
//    console.log("I'm Batman.", auth);
//    //return db.logout();
//});

export default Adapter.extend({
  db: db,
});
