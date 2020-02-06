import { connect } from 'react-redux';
import Service from './component';

const mapStateToProps = state => ({
  token: state.token.token,
});

export default connect(mapStateToProps)(Service);
