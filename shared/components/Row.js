import { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { DateTime } from 'luxon';
import cc from 'classcat';

import vars from '../variables';
import ReactionGroup from './ReactionGroup';

export default class Card extends PureComponent {
  static propTypes = {
    newsId: PropTypes.number.isRequired,
    title: PropTypes.string,
    date: PropTypes.number,
    sourcename: PropTypes.string,
    img: PropTypes.string,
    reactions: PropTypes.array,
    url: PropTypes.string.isRequired,
    handleArticleClick: PropTypes.func.isRequired,
    handleOpenModal: PropTypes.func.isRequired,
  };

  static defaultProps = {
    title: '',
    date: null,
    sourcename: '',
    img: '',
    reactions: [],
  };

  constructor(props) {
    super(props);
    this.state = {
      imageFailed: false,
    };
  }

  componentDidMount() {
    this.loadImage();
  }

  loadImage = () => {
    const { img } = this.props;
    if (!img || img === 'null') {
      this.setState({
        imageFailed: true,
      });
      return;
    }

    const image = new Image();
    image.onerror = () => {
      this.setState({
        imageFailed: true,
      });
    };
    image.src = this.props.img;
  };

  openLink = (e) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || (e.nativeEvent && e.nativeEvent.which === 2)) {
      // Proceed as usual for new tab / new window shortcut
      return;
    }

    e.preventDefault();
    const { newsId, url, handleArticleClick } = this.props;
    handleArticleClick(newsId, url);
  };

  render() {
    const { imageFailed } = this.state;
    const {
      title, date, url, sourcename, img, reactions, newsId,
    } = this.props;

    const dateObj = DateTime.fromMillis(date * 1000);
    const cardDate = dateObj.toFormat('HH:mm');

    let pictureStyle = {};
    if (img && img !== 'null' && !imageFailed) {
      pictureStyle = { backgroundImage: `url('${img}')` };
    }

    return (
      <div className="Row">
        <a href={`${url}`} onClick={this.openLink}>
          <div className={cc(['picture', { failed: imageFailed }])} style={pictureStyle} />
        </a>
        <div className="content">
          <a href={`${url}`} onClick={this.openLink}>
            <h3 className="title">{title}</h3>
          </a>
          <div className="timeAndSource">
            <span className="time">{cardDate}</span>
            <span className="spacer">|</span>
            <span className="source">{sourcename}</span>
            <ReactionGroup
              newsId={newsId}
              reactions={reactions}
              handleOpenModal={this.props.handleOpenModal}
            />
          </div>
        </div>

        <style jsx>{`
          .Row {
            background: white;
            border: 1px solid ${vars.colors.paleGrey};
            overflow: hidden;
            width: 100%;
            display: flex;
            margin-bottom: 10px;
            border-radius: 5px;
          }

          :global(a:last-child > .Row) {
            border-bottom: none;
          }

          .picture {
            width: 120px;
            min-height: 80px;
            display: block;
            position: relative;
            background: #f0f0f0;
            background-size: cover;
            flex-shrink: 0;
            cursor: pointer;
          }

          .picture.failed {
            background-image: url('/static/img_placeholder.png');
            background-size: 90px 74px;
            background-repeat: no-repeat;
            background-position: 50% 50%;
          }

          .content {
            padding: 10px;
            color: black;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
          }

          .title {
            font-size: 20px;
            font-weight: 500;
            color: ${vars.colors.slate};
            transition: color 150ms ease;
            cursor: pointer;
          }

          .title:hover {
            color: ${vars.colors.coralPink};
          }

          .timeAndSource {
            margin-top: 10px;
            color: ${vars.colors.steel};
            font-weight: 300;
          }

          .spacer {
            margin: 0 4px;
          }

          @media screen and (min-width: 480px) {
            .picture {
              height: 120px;
              width: 200px;
            }

            .content {
              padding: 15px;
            }

            .title {
              font-size: 20px;
              font-weight: 300;
            }
          }
        `}</style>
      </div>
    );
  }
}
