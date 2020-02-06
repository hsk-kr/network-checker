import { connect } from 'react-redux';
import { deleteToken } from '../../redux';
import Navbar from './component';

const mapStateToProps = state => ({
  token: state.token.token,
});

const mapDispatchToProps = dispatch => ({
  deleteToken: () => dispatch(deleteToken()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Navbar);
