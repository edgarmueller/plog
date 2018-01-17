import React from 'react';
import { Button, Grid } from 'material-ui';
import ContentAdd from 'material-ui-icons/Add';
import PropTypes from 'prop-types';
import BlockComponent from './BlockComponent';
import RenderedBlock from './RenderedBlock';
import { withPost } from '../common/withPost';

const RenderedPost = ({ post, isFetchingBlock, focusedBlockId }) => (
  <div>
    {
        post.blocks.map(block =>
          (
            <RenderedBlock
              key={block.id || block.tempid}
              postId={post.id}
              isFetchingBlock={isFetchingBlock}
              block={block}
              isFocused={block === focusedBlockId}
            />
          ),
        )
      }
  </div>
  );

RenderedPost.propTypes = {
  post: PropTypes.shape({
    id: PropTypes.number,
    blocks: PropTypes.arrayOf(
      PropTypes.shape({
        dialect: PropTypes.string.isRequired,
        text: PropTypes.string,
      }),
    ),
  }).isRequired,
  isFetchingBlock: PropTypes.bool.isRequired,
  focusedBlockId: PropTypes.number,
};


class Editor extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      showEditorOnly: false,
      showRenderedOnly: false,
      showBoth: true,
      focusedBlockId: undefined,
    };
  }

  render() {
    const { post, handleSetBlocks, isFetchingBlock, handleAddBlock } = this.props;

    if (post === undefined) {
      return <div>No post!</div>;
    }

    return (
      <Grid container spacing={0} style={{ paddintgTop: '1em' }}>
        <Grid item xs={4}>
          {
            post.blocks.map((block, index) =>
              (
                <BlockComponent
                  key={block.id || block.tempid}
                  postId={post.id}
                  block={block}
                  blocks={post.blocks}
                  blockIndex={index}
                  onFocus={() => this.setState({ focusedBlockId: block.id })}
                  isFocused={block.id === this.state.focusedBlockId}
                  handleSetBlocks={handleSetBlocks}
                />
              ),
            )
          }
          <Button
            fab
            onClick={() => handleAddBlock()}
            color="default"
          >
            <ContentAdd />
          </Button>
        </Grid>
        <Grid item xs={8}>
          <RenderedPost
            post={post}
            blocks={post.blocks}
            isFetchingBlock={isFetchingBlock}
            focusedBlockId={this.state.focusedBlockId}
          />
        </Grid>
      </Grid>
    );
  }
}

export default withPost(Editor);