import * as actions from '../constants/actions';

// Types

function exchangeTypesRequest() {
  return { type: actions.EXCHANGE_TYPES_REQUEST };
}

function exchangeTypesSuccess(types) {
  return { type: actions.EXCHANGE_TYPES_SUCCESS, types };
}

function exchangeTypesFailure(message) {
  return { type: actions.EXCHANGE_TYPES_FAILURE, message };
}

export function ExchangeTypes() {
  return (dispatch, getState) => {
    const cluster = localStorage.getItem('cluster');

    dispatch(exchangeTypesRequest());
    if (!cluster) {
      dispatch(exchangeTypesFailure('No authorization'));
      return;
    }

    const client = hprose.Client.create(cluster, { Exchange: ['Types'] });

    client.Exchange.Types(null, (resp) => {
      if (resp.success) {
        dispatch(exchangeTypesSuccess(resp.data));
      } else {
        dispatch(exchangeTypesFailure(resp.message));
      }
    }, (resp, err) => {
      dispatch(exchangeTypesFailure('Server error'));
      console.log('【Hprose】Exchange.Types Error:', resp, err);
    });
  };
}

// List

function exchangeListRequest() {
  return { type: actions.EXCHANGE_LIST_REQUEST };
}

function exchangeListSuccess(total, list) {
  return { type: actions.EXCHANGE_LIST_SUCCESS, total, list };
}

function exchangeListFailure(message) {
  return { type: actions.EXCHANGE_LIST_FAILURE, message };
}

export function ExchangeList(size, page) {
  return (dispatch, getState) => {
    const cluster = localStorage.getItem('cluster');
    const token = localStorage.getItem('token');

    dispatch(exchangeListRequest());
    if (!cluster || !token) {
      dispatch(exchangeListFailure('No authorization'));
      return;
    }

    const client = hprose.Client.create(cluster, { Exchange: ['List'] });

    client.setHeader('Authorization', `Bearer ${token}`);
    client.Exchange.List(size, page, (resp) => {
      if (resp.success) {
        dispatch(exchangeListSuccess(resp.data.total, resp.data.list));
      } else {
        dispatch(exchangeListFailure(resp.message));
      }
    }, (resp, err) => {
      dispatch(exchangeListFailure('Server error'));
      console.log('【Hprose】Exchange.List Error:', resp, err);
    });
  };
}

// Put

function exchangePutRequest() {
  return { type: actions.EXCHANGE_PUT_REQUEST };
}

function exchangePutSuccess() {
  return { type: actions.EXCHANGE_PUT_SUCCESS };
}

function exchangePutFailure(message) {
  return { type: actions.EXCHANGE_PUT_FAILURE, message };
}

export function ExchangePut(req, size, page) {
  return (dispatch, getState) => {
    const cluster = localStorage.getItem('cluster');
    const token = localStorage.getItem('token');

    dispatch(exchangePutRequest());
    if (!cluster || !token) {
      dispatch(exchangePutFailure('No authorization'));
      return;
    }

    const client = hprose.Client.create(cluster, { Exchange: ['Put'] });

    client.setHeader('Authorization', `Bearer ${token}`);
    client.Exchange.Put(req, (resp) => {
      if (resp.success) {
        dispatch(ExchangeList(size, page));
        dispatch(exchangePutSuccess());
      } else {
        dispatch(exchangePutFailure(resp.message));
      }
    }, (resp, err) => {
      dispatch(exchangePutFailure('Server error'));
      console.log('【Hprose】Exchange.Put Error:', resp, err);
    });
  };
}

// Delete

function exchangeDeleteRequest() {
  return { type: actions.EXCHANGE_DELETE_REQUEST };
}

function exchangeDeleteSuccess() {
  return { type: actions.EXCHANGE_DELETE_SUCCESS };
}

function exchangeDeleteFailure(message) {
  return { type: actions.EXCHANGE_DELETE_FAILURE, message };
}

export function ExchangeDelete(ids, size, page) {
  return (dispatch, getState) => {
    const cluster = localStorage.getItem('cluster');
    const token = localStorage.getItem('token');

    dispatch(exchangeDeleteRequest());
    if (!cluster || !token) {
      dispatch(exchangeDeleteFailure('No authorization'));
      return;
    }

    const client = hprose.Client.create(cluster, { Exchange: ['Delete'] });

    client.setHeader('Authorization', `Bearer ${token}`);
    client.Exchange.Delete(ids, (resp) => {
      if (resp.success) {
        dispatch(ExchangeList(size, page));
        dispatch(exchangeDeleteSuccess());
      } else {
        dispatch(exchangeDeleteFailure(resp.message));
      }
    }, (resp, err) => {
      dispatch(exchangeDeleteFailure('Server error'));
      console.log('【Hprose】Exchange.Delete Error:', resp, err);
    });
  };
}