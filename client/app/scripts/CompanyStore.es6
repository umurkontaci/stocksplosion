import EventEmitter from 'wolfy87-eventemitter';
const CHANGE_EVENT = 'change';

class CompanyStore extends EventEmitter {
  constructor(appDispatcher) {
    super();
    this._companies = {};
    this._appDispatcher = appDispatcher;

    this.dispatcherIndex = appDispatcher.register((payload) => {
      let action = payload.action;
      switch (action.actionType) {
        case 'add': // use a const
          this.add(action.company);
          this.emitChange();
          break;
        case 'remove':
          this.remove(action.companyId);
          this.emitChange();
          break;
      }

      return true;
    });
  }
  *getAll() {
    for (let id in this._companies) {
      //noinspection JSUnfilteredForInLoop
      yield this._companies[id];
    }
  }
  add(company) {
    this._companies[company.id] = company;
  }
  remove(companyId) {
    delete this._companies[companyId];
  }
  emitChange() {
    this.emit(this.CHANGE_EVENT);
  }
  addChangeListener(callback) {
    this.on(this.CHANGE_EVENT, callback);
  }
  removeChangeListener(callback) {
    this.removeListener(this.CHANGE_EVENT, callback);
  }
}
