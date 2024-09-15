// app/Services/FinancialAnalysisService.ts

export class FinancialAnalysisError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'FinancialAnalysisError'
  }
}

export default class FinancialAnalysisService {
  static calculateEpsGrowth(
    epsForward: number | null,
    epsTrailingTwelveMonths: number | null
  ): number {
    if (
      epsForward === 0 ||
      epsForward === null ||
      epsTrailingTwelveMonths === 0 ||
      epsTrailingTwelveMonths === null
    ) {
      throw new FinancialAnalysisError('Invalid EPS data provided for growth calculation.')
    }
    return ((epsForward - epsTrailingTwelveMonths) / epsTrailingTwelveMonths) * 100
  }

  static evaluateCompany(peRatio: number | null, epsGrowth: number | null): string {
    if (peRatio === null || epsGrowth === null) {
      throw new FinancialAnalysisError(
        'Invalid PE Ratio or EPS Growth data provided for evaluation.'
      )
    }

    if (peRatio < 15) {
      if (epsGrowth > 10) {
        return 'This stock might be undervalued. It could be a good investment!'
      } else if (epsGrowth < 0) {
        return 'This stock might be undervalued, but declining earnings could be a concern.'
      } else {
        return 'This stock might be undervalued, but further analysis is needed.'
      }
    } else if (peRatio > 25) {
      return 'This stock might be overvalued. Be cautious!'
    }

    // if (peRatio < 15) {
    //   return epsGrowth > 10
    //     ? 'This stock might be undervalued. It could be a good investment!'
    //     : 'This stock might be undervalued, but further analysis is needed.'
    // } else if (peRatio > 25) {
    //   return 'This stock might be overvalued. Be cautious!'
    // }
    return 'This company seems fairly valued.'
  }
}
