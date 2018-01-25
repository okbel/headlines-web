import { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { DateTime } from 'luxon'
import cc from 'classcat'

import ReactionGroup from './ReactionGroup'

export default class Card extends PureComponent {
  static propTypes = {
    title: PropTypes.string,
    date: PropTypes.number,
    sourcename: PropTypes.string,
    img: PropTypes.string,
    reactions: PropTypes.array,
  }

  static defaultProps = {
    title: '',
    date: null,
    sourcename: '',
    img: '',
    reactions: [],
  }

  constructor(props) {
    super(props)
    this.state = {
      imageFailed: false,
    }
  }

  componentDidMount() {
    this.loadImage()
  }

  loadImage = () => {
    const { img } = this.props
    if (!img || img === 'null') {
      this.setState({
        imageFailed: true,
      })
      return
    }

    const image = new Image()
    image.onerror = () => {
      this.setState({
        imageFailed: true,
      })
    }
    image.src = this.props.img
  }

  render() {
    const { imageFailed } = this.state
    const {
      title,
      date,
      sourcename,
      img,
      reactions,
    } = this.props

    const dateObj = DateTime.fromMillis(date * 1000)
    const cardDate = dateObj.toFormat('HH:mm')

    let pictureStyle = {}
    if (img && img !== 'null' && !imageFailed) {
      pictureStyle = { backgroundImage: `url('${img}')` }
    }

    return (
      <div className="Row" {...this.props}>
        <div className={cc(['picture', { failed: imageFailed }])} style={pictureStyle} />
        <div className="content">
          <h3 className="title">{title}</h3>
          <div className="timeAndSource">
            <span className="time">{cardDate}</span>
            <span className="spacer">|</span>
            <span className="source">{sourcename}</span>
            <ReactionGroup reactions={reactions} />
          </div>
        </div>

        <style jsx>{`
          .Row {
            background: white;
            overflow: hidden;
            cursor: pointer;
            width: 100%;
            display: flex;
            border: 1px solid #F0F0F0;
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
            background: #F0F0F0;
            background-size: cover;
            flex-shrink: 0;
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
            font-size: 16px;
            font-weight: 300;
          }

          .timeAndSource {
            margin-top: 10px;
            font-weight: 500;
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
    )
  }
}
