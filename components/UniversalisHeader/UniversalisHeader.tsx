import Link from 'next/link';
import { Item } from '../../types/game/Item';
import SearchBar from '../SearchBar/SearchBar';
import Tooltip from '../Tooltip/Tooltip';

interface UniversalisHeaderProps {
  onResults: (results: Item[], totalResults: number, searchTerm: string) => void;
  onSettingsClicked: () => void;
  onMarketClicked: () => void;
}

const UniversalisHeader = ({
  onResults,
  onSettingsClicked,
  onMarketClicked,
}: UniversalisHeaderProps) => {
  return (
    <>
      <div>
        <div className="header-home">
          <Link href="/">
            <a className="btn-home">
              <img
                src="/i/universalis/universalis.png"
                alt="Universalis"
                width={41.75}
                height={64}
              />
            </a>
          </Link>
        </div>
        <SearchBar onMarketClicked={onMarketClicked} onResults={onResults} />
      </div>
      <div>
        <Link href="/account/login/discord">
          <a className="btn-login">Login via Discord</a>
        </Link>
        <div>
          <Tooltip label="Site Settings">
            <button className="btn-settings" onClick={onSettingsClicked}>
              <span className="xiv-app_drawer_setting" />
            </button>
          </Tooltip>
        </div>
      </div>
    </>
  );
};

export default UniversalisHeader;
