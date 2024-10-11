import { Router } from 'express'

import { router as expensesRouter } from '@/http/routes/expenses'
import { router as schedulesRouter } from '@/http/routes/schedules'

const router = Router()

router.use('/expenses', expensesRouter)
router.use('/schedules', schedulesRouter)

export default router