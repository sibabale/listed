/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
const AnalysesController = () => import('#controllers/analyses_controller')

router.get('/', async () => {
  return {
    welcome: 'Welcome to listed',
  }
})

router.get('analyse', [AnalysesController, 'evaluateCompanyValuation'])
