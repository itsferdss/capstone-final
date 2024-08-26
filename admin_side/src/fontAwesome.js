import { createApp } from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faMoneyBillAlt, faGlobe, faPaperPlane, faShoppingCart } from '@fortawesome/free-solid-svg-icons';

library.add(faMoneyBillAlt, faGlobe, faPaperPlane, faShoppingCart);

const app = createApp({});
app.component('font-awesome-icon', FontAwesomeIcon);

export default app;