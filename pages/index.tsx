import type { NextPage, NextPageContext } from 'next';
import Head from 'next/head';
import HomeAction from '../components/HomeAction/HomeAction';
import HomeLoggedOut from '../components/HomeLoggedOut/HomeLoggedOut';
import HomeNavbar from '../components/HomeNavbar/HomeNavBar';
import HomeNews from '../components/HomeNews/HomeNews';
import RecentUpdatesPanel from '../components/RecentUpdatesPanel/RecentUpdatesPanel';
import TaxRatesPanel from '../components/TaxRatesPanel/TaxRatesPanel';
import UploadCountPanel from '../components/UploadCountPanel/UploadCountPanel';
import { City } from '../types/game/City';

interface RecentItem {
  id: number;
  levelItem: number;
  rarity: number;
  name: string;
  category?: string;
}

interface HomeProps {
  taxes: Record<City, number>;
  recent: RecentItem[];
  dailyUploads: number[];
}

function sum(arr: number[], start: number, end: number) {
  return arr.slice(start, end).reduce((a, b) => a + b, 0);
}

const Home: NextPage<HomeProps> = ({ taxes, recent, dailyUploads }: HomeProps) => {
  const title = 'Universalis';
  const description =
    'Final Fantasy XIV Online: Market Board aggregator. Find Prices, track Item History and create Price Alerts. Anywhere, anytime.';
  return (
    <>
      <Head>
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta name="description" content={description} />
        <title>{title}</title>
      </Head>

      <div className="home">
        <HomeNavbar />
        <div>
          <HomeNews />
          <HomeLoggedOut />
        </div>
        <div>
          <HomeAction />
          <h4>Recent Updates</h4>
          <RecentUpdatesPanel items={recent} />
          <TaxRatesPanel data={taxes} />
          <UploadCountPanel today={sum(dailyUploads, 0, 1)} week={sum(dailyUploads, 0, 7)} />
          <p className="mog-honorable" style={{ textAlign: 'center', marginTop: 5 }}>
            Thank you!
          </p>
        </div>
      </div>
    </>
  );
};

export async function getServerSideProps(ctx: NextPageContext) {
  let taxes: Record<City, number>;
  try {
    const taxRates = await fetch(`https://universalis.app/api/tax-rates?world=Phoenix`).then(
      (res) => res.json()
    );
    taxes = {
      [City.LimsaLominsa]: taxRates['Limsa Lominsa'],
      [City.Gridania]: taxRates['Gridania'],
      [City.Uldah]: taxRates["Ul'dah"],
      [City.Ishgard]: taxRates['Ishgard'],
      [City.Kugane]: taxRates['Kugane'],
      [City.Crystarium]: taxRates['Crystarium'],
      [City.OldSharlayan]: taxRates['Old Sharlayan'],
    };
  } catch (err) {
    console.log(err);
    taxes = {
      [City.LimsaLominsa]: 0,
      [City.Gridania]: 0,
      [City.Uldah]: 0,
      [City.Ishgard]: 0,
      [City.Kugane]: 0,
      [City.Crystarium]: 0,
      [City.OldSharlayan]: 0,
    };
  }

  const recent: RecentItem[] = [];
  try {
    const recentlyUpdated = await fetch(
      'https://universalis.app/api/extra/stats/recently-updated'
    ).then((res) => res.json());
    const shown = recentlyUpdated.items.slice(0, 6);
    for (const s of shown) {
      try {
        const itemData = await fetch(`https://xivapi.com/Item/${s}`).then((res) => res.json());
        recent.push({
          id: s,
          levelItem: itemData.LevelItem,
          rarity: itemData.Rarity,
          name: itemData.Name,
          category: itemData.ItemSearchCategory.Name,
        });
      } catch (err) {
        recent.push({
          id: s,
          levelItem: 0,
          rarity: 0,
          name: '',
        });
      }
    }
  } catch (err) {
    console.log(err);
  }

  const dailyUploads: number[] = [];
  try {
    const uploadHistory = await fetch(
      'https://universalis.app/api/extra/stats/upload-history'
    ).then((res) => res.json());
    dailyUploads.push(...uploadHistory.uploadCountByDay);
  } catch (err) {
    console.log(err);
  }

  return {
    props: { taxes, recent, dailyUploads },
  };
}

export default Home;
