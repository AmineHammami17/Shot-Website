const router = express.Router();
const userController = require('./userController');
const { protect } = require('../middlewares/auth');

router.post('/add-card', protect, userController.addPaymentCard);

module.exports = router;