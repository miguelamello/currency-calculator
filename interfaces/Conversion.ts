
interface Conversion {
  [key: number]: {
    transaction_id: string;
    user_id: string;
    source_currency: string;
    source_value: string;
    target_currency: string;
    target_value: string;
    conversion_rate: string;
    utc_datetime: string;
  }
}

export default Conversion;

