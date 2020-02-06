import { connect } from 'react-redux';
import MyProfile from './component';
import { deleteToken } from '../../redux';

const mapStateToProps = state => ({
  token: state.token.token,
});

const mapDispatchToProps = dispatch => ({
  deleteToken: () => dispatch(deleteToken()),
});

export default connect(mapStateToProps, mapDispatchToProps)(MyProfile);
