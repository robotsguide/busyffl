import Ember from 'ember';
import moment from 'moment';

export function dateFromNow(params/*, hash*/) {
  const date = params[0];

  return moment(date*1000).fromNow();
}

export default Ember.Helper.helper(dateFromNow);
