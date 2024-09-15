import axios from 'axios'
import type { HttpContext } from '@adonisjs/core/http'

import env from '#start/env'
import FinancialAnalysisService from '#services/financial_analysis_service'

export default class AnalysesController {
  async evaluateCompanyValuation({ request, response }: HttpContext) {
    const symbol = request.input('symbol') as string
    if (!symbol) {
      return response.status(400).send({
        error: 'Symbol is required.',
      })
    }

    const options = {
      method: 'GET',
      url: `https://yfapi.net/v6/finance/quote?region=US&lang=en&symbols=${symbol}`,
      headers: {
        'accept': 'application/json',
        'x-api-key': env.get('YAHOO_API_KEY'),
      },
    }

    try {
      const axiosResponse = await axios.request(options)
      const data = axiosResponse.data
      console.log(`Data received: ${JSON.stringify(data)}`)

      const quote = data.quoteResponse.result[0]
      const peRatio = typeof quote.trailingPE === 'number' ? quote.trailingPE : 'Not Available'
      const epsTrailingTwelveMonths =
        typeof quote.epsTrailingTwelveMonths === 'number'
          ? quote.epsTrailingTwelveMonths
          : 'Not Available'
      const epsForward = typeof quote.epsForward === 'number' ? quote.epsForward : 'Not Available'

      const epsGrowth =
        epsForward !== 'Not Available' && epsTrailingTwelveMonths !== 'Not Available'
          ? FinancialAnalysisService.calculateEpsGrowth(epsForward, epsTrailingTwelveMonths)
          : 'Not Available'

      const result =
        typeof peRatio === 'number'
          ? FinancialAnalysisService.evaluateCompany(peRatio, epsGrowth)
          : 'Data is insufficient for valuation.'

      return response.status(200).send({
        peRatio,
        epsGrowth,
        result,
        data,
      })
    } catch (error) {
      console.error('Error occurred:', error.response ? error.response.data : error.message)
      return response.status(500).send({
        error: 'An error occurred while fetching data.',
        details: error.response ? error.response.data : error.message,
      })
    }
  }
}
