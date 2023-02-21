import { useEffect, useState } from 'react';
import {
  useExtensionApi,
  render,
  Banner,
  useSessionToken,
} from '@shopify/checkout-ui-extensions-react';

render('Checkout::Dynamic::Render', () => (
  <Extension />
));

function Extension() {
  const { shop } = useExtensionApi();
  const [data, setData] = useState();

  const sessionToken = useSessionToken();


  useEffect( async () => {
  

    const access_token = await sessionToken.get();

    console.log(access_token);

    fetch(
      `${shop.storefrontUrl}admin/api/2023-01/discount_codes/count.json`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Access-Token': `${access_token}`,
          'Access-Control-Allow-Origin': '*'
        }
      },
    )
      .then((response) => {
        console.log('=============response== =====================');
        console.warn(response.body)
        console.log(response);
        console.log('====================================');
        return response.json()
      })
      .then(({ data, errors }) => {
        console.log('=============data=======================');
        console.log(data);
        console.log('====================================');
        console.log('=================errors===================');
        console.log(errors);
        console.log('====================================');
        setData(data)});
  }, [shop]);

  return (
    <Banner title="qr-code-checkout-ui">
      "welcome disount afdsfs"
    </Banner>
  );
}
