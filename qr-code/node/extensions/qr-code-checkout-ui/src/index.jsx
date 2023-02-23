import { useEffect, useState } from 'react';
import {
  useExtensionApi,
  render,
  Banner,
  useSessionToken,
  useOrder
} from '@shopify/checkout-ui-extensions-react';



render('Checkout::Dynamic::Render', () => (
  <Extension />
));

function Extension() {
  const orderDetails = useOrder();
  const { shop } = useExtensionApi();
  const sessionToken = useSessionToken();

  const useStoreFrontAPI = async function () {
    const getProductsQuery = {
      query: `query ($first: Int!) {
          products(first: $first) {
            nodes {
              id
              title
            }
          }
        }`,
      variables: { first: 5 },
    };

    const apiVersion = 'unstable';

    fetch(
      `${shop.storefrontUrl}api/${apiVersion}/graphql.json`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(getProductsQuery),
      },
    )
      .then((response) => response.json())
      .then(({ data, errors }) => {
        console.log('=================useStoreFrontAPI===================');
        console.log(data);
        console.log('====================================');
        console.log('============useStoreFrontAPI=====errors===================');
        console.log(errors);
        console.log('====================================');
      });
  }

  const useAdminApi = async function () {
    const access_token = await sessionToken.get();

    console.log('=================orderDetails===================');
    console.log(orderDetails);
    console.log('====================================');
    const getAccessScope = `https://testing-checkout-ui2.myshopify.com/admin/oauth/access_scopes.json`;
    const getStore = "api/discounts";
    fetch(
      // `${shop.storefrontUrl}admin/api/2023-01/discount_codes/count.json`,
      getStore,
      {
        method: 'GET',
        headers: {
          // 'Content-Type': 'application/json',
          'X-Shopify-Access-Token': `${access_token}`
        }
      },
    )
      .then((response) => {
        console.log('=============useAdminApi=======================');
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
        setData(data)
      });
  }


  const callAppBackend = async function () {
    const access_token = await sessionToken.get();

    try {
      console.log('==============callAppBackend======================');
      console.log(access_token);
      console.log(shop);
      const url = `https://27f4-2409-4050-2d48-795f-153c-3624-ef23-2b03.in.ngrok.io/api/discounts`
      console.log(url);
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          'X-Shopify-Access-Token': `${access_token}`
        },
      });

      console.log('==============callAppBackend======================');
      console.log(response);
      console.log(await response.json());
      console.log('====================================');
    } catch (error) {
      console.log('==============callAppBackend err0r======================');
      console.log(error);
      console.log('====================================');
    }
  }

  const main = async function () {
    await useStoreFrontAPI();
    await callAppBackend();
  }


  useEffect(() => {
    main();
  }, [shop])


  return (
    <Banner title="qr-code-checkout-ui">
      "welcome disount afdsfs"
    </Banner>
  );
}
