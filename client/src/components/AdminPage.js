import Admins from './Admins.js';
import Preferences from './Preferences.js';
import TourismGoverners from './TourismGoverners.js';
import Categories from './Categories.js';
import Products from './Products.js';
import AdminDeleteAccount from './adminDeleteAccountH.js';

function AdminPage(){
    return (
        <div className='App'>
            <Admins />
            <TourismGoverners />
            <Categories />
            <Products />
            <AdminDeleteAccount />
        </div>
    );
}
export default AdminPage;