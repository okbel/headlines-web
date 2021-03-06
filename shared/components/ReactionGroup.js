import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Reaction from './Reaction';
import AddReaction from './AddReaction';

export default class ReactionGroup extends Component {
  static propTypes = {
    reactions: PropTypes.array,
    handleOpenModal: PropTypes.func.isRequired,
    newsId: PropTypes.number.isRequired,
  };

  static defaultProps = {
    reactions: [],
  };

  orderByAmount = (a, b) => {
    if (a.amount < b.amount) {
      return 1;
    }
    if (a.amount > b.amount) {
      return -1;
    }
    return 0;
  };

  render() {
    const { reactions, newsId } = this.props;
    const ordered = reactions.sort(this.orderByAmount);

    return (
      <div className="ReactionGroup">
        <AddReaction handleOpenModal={this.props.handleOpenModal} newsId={newsId} />
        {ordered.map(({ reaction, amount }) => (
          <Reaction key={`${reaction}_${newsId}`} emoji={reaction} amount={amount} />
        ))}
        <style jsx>
          {`
            .ReactionGroup {
              margin-top: 10px;
              display: flex;
              flex-wrap: wrap;
            }
            .ReactionGroup :global(div) {
              margin-right: 5px;
              margin-bottom: 5px;
            }
          `}
        </style>
      </div>
    );
  }
}
