import { connect } from 'react-redux';
import Service from '../components/Service';

const mapStateToProps = (state) => ({
  token: state.token.token
});

export default connect(mapStateToProps)(Service);