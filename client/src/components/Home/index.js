import Home from './component';
import { connect } from 'react-redux';
import { saveToken, deleteToken } from '../../redux';

const mapStateToProps = state => ({
  token: state.token.token,
});

const mapDispatchToProps = dispatch => ({
  saveToken: token => dispatch(saveToken(token)),
  deleteToken: () => dispatch(deleteToken()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Home);
