/*
  Copyright 2015 Skippbox, Ltd

  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at

      http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
*/
import Colors from 'styles/Colors';
import ListInputItem from 'components/commons/ListInputItem';
import ListHeader from 'components/commons/ListHeader';
import DeploymentsActions from 'actions/DeploymentsActions';
import NavigationActions from 'actions/NavigationActions';
import AlertUtils from 'utils/AlertUtils';
import ScrollView from 'components/commons/ScrollView';

const { PropTypes } = React;

const {
  View,
  ActivityIndicator,
  StyleSheet,
  DeviceEventEmitter,
} = ReactNative;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.BACKGROUND,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    marginTop: 20,
  },
  loader: {
    position: 'absolute',
    left: 0, bottom: 0, right: 0, top: 0,
  },
});

export default class DeploymentsNew extends Component {

  static propTypes = {
    cluster: PropTypes.instanceOf(Immutable.Map).isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      name: '',
      image: '',
      loading: false,
    };
  }

  componentDidMount() {
    this.submitListener = DeviceEventEmitter.addListener('DeploymentsNew:submit', this.onSubmit.bind(this));
  }

  componentWillUnmount() {
    this.submitListener.remove();
  }

  render() {
    return (
      <View style={styles.container}>
        <ScrollView style={styles.scrollView}
          contentContainerStyle={styles.scrollViewContent}
          keyboardDismissMode={'interactive'}
          keyboardShouldPersistTaps={true}>
          <ListHeader title=""/>
          <ListInputItem autoCapitalize="none" autoCorrect={false} defaultValue={this.state.name} placeholder="Optional name"
          onChangeText={name => this.setState({name})}/>
          <ListInputItem autoCapitalize="none" autoCorrect={false} defaultValue={this.state.image} placeholder="Image"
            onChangeText={image => this.setState({image})} isLast={true}/>
        </ScrollView>
        {this.state.loading && <ActivityIndicator animating={this.state.loading} style={styles.loader}/>}
      </View>
    );
  }

  onSubmit() {
    if (!this.state.image) {
      AlertUtils.showWarning({message: intl('deployment_new_empty_image')});
      return;
    }
    this.setState({loading: true});
    DeploymentsActions.createDeployment({
      cluster: this.props.cluster,
      name: (this.state.name || this.state.image).toLowerCase(),
      image: this.state.image,
    }).then(() => NavigationActions.pop());
  }

}
